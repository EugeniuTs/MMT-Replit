import { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { useListBookings, useUpdateBookingStatus, getListBookingsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle, XCircle, Download, ChevronRight, X, User, Mail, Phone,
  Globe, Calendar, Bike, CreditCard, MapPin, Clock, Shield, FileText,
  AlertCircle, DollarSign, TrendingUp, BookOpen
} from "lucide-react";

type Booking = NonNullable<ReturnType<typeof useListBookings>["data"]>[number];

function statusBadge(status: string) {
  if (status === "approved" || status === "paid") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  if (status === "cancelled" || status === "refunded") return "bg-red-500/15 text-red-400 border-red-500/20";
  return "bg-amber-500/15 text-amber-400 border-amber-500/20";
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary flex-shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground break-all">{value || "—"}</p>
      </div>
    </div>
  );
}

function BookingDetailPanel({ booking, onClose, onApprove, onCancel, isPending }: {
  booking: Booking;
  onClose: () => void;
  onApprove: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const depositPct = booking.totalAmount > 0 ? Math.round((booking.depositAmount / booking.totalAmount) * 100) : 20;

  return (
    <div className="h-full flex flex-col bg-card border-l border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Booking #{booking.id}</p>
          <h2 className="text-lg font-display text-foreground leading-tight">{booking.fullName}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status banner */}
        <div className="px-5 py-3 border-b border-border flex gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusBadge(booking.bookingStatus)}`}>
            {booking.bookingStatus === "approved" && <CheckCircle className="w-3 h-3" />}
            {booking.bookingStatus === "cancelled" && <XCircle className="w-3 h-3" />}
            {booking.bookingStatus === "pending" && <AlertCircle className="w-3 h-3" />}
            Booking: {booking.bookingStatus}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusBadge(booking.paymentStatus)}`}>
            <CreditCard className="w-3 h-3" />
            Payment: {booking.paymentStatus}
          </span>
        </div>

        {/* Payment summary */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-3">Payment Summary</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Tour Price</p>
              <p className="text-lg font-bold text-foreground">€{booking.totalAmount}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Deposit ({depositPct}%)</p>
              <p className="text-lg font-bold text-primary">€{booking.depositAmount}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-lg font-bold text-foreground capitalize">{booking.paymentType}</p>
            </div>
          </div>
        </div>

        {/* Tour info */}
        <div className="px-5 py-4 border-b border-border space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Tour Details</p>
          <DetailRow icon={MapPin} label="Tour" value={booking.tour?.name} />
          <DetailRow icon={Clock} label="Duration" value={booking.tour ? `${booking.tour.durationDays} day${booking.tour.durationDays > 1 ? "s" : ""}` : undefined} />
          {booking.tourDate && (
            <>
              <DetailRow icon={Calendar} label="Start Date" value={formatDate(booking.tourDate.startDate)} />
              <DetailRow icon={Calendar} label="End Date" value={formatDate(booking.tourDate.endDate)} />
            </>
          )}
        </div>

        {/* Rider info */}
        <div className="px-5 py-4 border-b border-border space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Rider Information</p>
          <DetailRow icon={User} label="Full Name" value={booking.fullName} />
          <DetailRow icon={Mail} label="Email" value={booking.email} />
          <DetailRow icon={Phone} label="Phone" value={booking.phone} />
          <DetailRow icon={Globe} label="Country" value={booking.country} />
          <DetailRow icon={Bike} label="Riding Experience" value={booking.ridingExperience} />
          <DetailRow
            icon={Shield}
            label="Motorcycle License"
            value={
              <span className={booking.hasLicense ? "text-emerald-400" : "text-red-400"}>
                {booking.hasLicense ? "✓ Confirmed" : "✗ Not confirmed"}
              </span>
            }
          />
        </div>

        {/* Metadata */}
        <div className="px-5 py-4 border-b border-border space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Booking Metadata</p>
          <DetailRow icon={FileText} label="Booking ID" value={`#${booking.id}`} />
          <DetailRow icon={Clock} label="Booked On" value={formatDate(booking.createdAt)} />
          {booking.stripePaymentIntentId && (
            <DetailRow icon={CreditCard} label="Stripe Payment ID" value={booking.stripePaymentIntentId} />
          )}
          {booking.notes && (
            <DetailRow icon={FileText} label="Notes" value={booking.notes} />
          )}
        </div>
      </div>

      {/* Actions footer */}
      {booking.bookingStatus === "pending" && (
        <div className="px-5 py-4 border-t border-border bg-card flex gap-3">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onApprove}
            disabled={isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={onCancel}
            disabled={isPending}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
      {booking.bookingStatus === "approved" && (
        <div className="px-5 py-4 border-t border-border bg-card">
          <Button
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={onCancel}
            disabled={isPending}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Booking
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ManageBookings() {
  const { isAuthenticated, authHeaders } = useAuth();
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useListBookings({ request: { headers: authHeaders } });
  const updateMutation = useUpdateBookingStatus({ request: { headers: authHeaders } });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!isAuthenticated) return <Redirect href="/admin/login" />;

  const selected = bookings?.find(b => b.id === selectedId) ?? null;

  const handleStatusUpdate = (id: number, status: "approved" | "cancelled") => {
    updateMutation.mutate({ id, data: { bookingStatus: status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() }),
    });
  };

  const handleExport = () => {
    window.open("/api/admin/bookings/export", "_blank");
  };

  const filtered = (bookings ?? []).filter(b =>
    statusFilter === "all" ? true : b.bookingStatus === statusFilter
  );

  // Stats
  const total = bookings?.length ?? 0;
  const approved = bookings?.filter(b => b.bookingStatus === "approved").length ?? 0;
  const pending = bookings?.filter(b => b.bookingStatus === "pending").length ?? 0;
  const revenue = bookings?.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + Number(b.depositAmount), 0) ?? 0;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selected ? "mr-[420px]" : ""}`}>
        <div className="p-6 lg:p-8 flex-1 overflow-y-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display">Bookings</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage and review all customer bookings</p>
            </div>
            <Button variant="outline" onClick={handleExport} className="self-start sm:self-auto gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Bookings", value: total, icon: BookOpen, color: "text-foreground" },
              { label: "Approved", value: approved, icon: CheckCircle, color: "text-emerald-400" },
              { label: "Pending", value: pending, icon: AlertCircle, color: "text-amber-400" },
              { label: "Revenue Collected", value: `€${revenue.toFixed(0)}`, icon: TrendingUp, color: "text-primary" },
            ].map(stat => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "pending", "approved", "cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="pl-5">Customer</TableHead>
                    <TableHead>Tour</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="hidden lg:table-cell">Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead className="pr-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i} className="border-border">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}><div className="h-4 bg-secondary rounded animate-pulse w-20" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className={`border-border cursor-pointer transition-colors ${
                        selectedId === booking.id
                          ? "bg-primary/10 hover:bg-primary/15"
                          : "hover:bg-secondary/40"
                      }`}
                      onClick={() => setSelectedId(selectedId === booking.id ? null : booking.id)}
                    >
                      <TableCell className="pl-5">
                        <div className="font-semibold text-sm">{booking.fullName}</div>
                        <div className="text-xs text-muted-foreground">{booking.country}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{booking.tour?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{booking.tour ? `${booking.tour.durationDays}d` : ""}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">{booking.tourDate ? formatDate(booking.tourDate.startDate) : "—"}</div>
                        {booking.tourDate && booking.tourDate.endDate && (
                          <div className="text-xs text-muted-foreground">→ {formatDate(booking.tourDate.endDate)}</div>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm font-semibold">€{booking.totalAmount}</div>
                        <div className="text-xs text-muted-foreground">dep. €{booking.depositAmount}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${statusBadge(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${statusBadge(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </TableCell>
                      <TableCell className="pr-5">
                        <div className="flex items-center justify-end gap-1">
                          {booking.bookingStatus === "pending" && (
                            <>
                              <button
                                title="Approve"
                                className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                                onClick={e => { e.stopPropagation(); handleStatusUpdate(booking.id, "approved"); }}
                                disabled={updateMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                title="Cancel"
                                className="p-1.5 rounded-md text-red-400 hover:bg-red-500/15 transition-colors"
                                onClick={e => { e.stopPropagation(); handleStatusUpdate(booking.id, "cancelled"); }}
                                disabled={updateMutation.isPending}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedId === booking.id ? "rotate-90 text-primary" : ""}`} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed right-0 top-0 bottom-0 w-[420px] z-40 shadow-2xl">
          <BookingDetailPanel
            booking={selected}
            onClose={() => setSelectedId(null)}
            onApprove={() => handleStatusUpdate(selected.id, "approved")}
            onCancel={() => handleStatusUpdate(selected.id, "cancelled")}
            isPending={updateMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
