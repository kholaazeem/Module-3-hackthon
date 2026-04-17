import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeaves, updateLeaveStatus } from '../../redux/slices/leaveSlice';
import DashboardLayout from '../../components/DashboardLayout';
import { CalendarDays, Check, X, Clock, FileText, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminLeaves = () => {
  const dispatch = useDispatch();
  
  // Fetching data from Redux Store
  const { items: leaves, status } = useSelector((state) => state.leaves);

  // Load all leaves when page opens
  useEffect(() => {
    dispatch(fetchAllLeaves());
  }, [dispatch]);

  const handleAction = (id, action) => {
    Swal.fire({
      title: `${action} Leave?`,
      text: `Are you sure you want to ${action.toLowerCase()} this leave request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'Approve' ? 'hsl(160, 45%, 28%)' : 'hsl(0, 72%, 51%)',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';
          
          // Updating status in Supabase
          await dispatch(updateLeaveStatus({ id, status: newStatus })).unwrap();
          
          Swal.fire({
            icon: 'success',
            title: `Leave ${action}d!`,
            text: `The request has been successfully ${newStatus.toLowerCase()}.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Action Failed',
            text: error.message || 'Could not update leave status.',
            confirmButtonColor: 'hsl(160, 45%, 28%)'
          });
        }
      }
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-primary" /> Leave Management
          </h1>
          <p className="text-muted-foreground">Review and manage student leave applications efficiently.</p>
        </div>

        {/* Premium Table Container */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          {status === 'loading' ? (
             <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
               <p className="text-muted-foreground font-medium">Fetching leave requests...</p>
             </div>
          ) : leaves.length === 0 ? (
             <div className="text-center py-12 border border-dashed border-border rounded-xl">
               <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
               <p className="text-muted-foreground font-medium">No leave requests available.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-4 font-semibold text-muted-foreground">Student Info</th>
                    <th className="py-4 px-4 font-semibold text-muted-foreground">Duration</th>
                    <th className="py-4 px-4 font-semibold text-muted-foreground">Reason</th>
                    <th className="py-4 px-4 font-semibold text-muted-foreground text-center">Attachment</th>
                    <th className="py-4 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="py-4 px-4 font-semibold text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors group">
                      
                      {/* Student Detail */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-foreground text-[15px]">{leave.student_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Applied: {formatDate(leave.created_at)}</div>
                      </td>
                      
                      {/* Duration */}
                      <td className="py-4 px-4 font-medium text-foreground">
                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                      </td>
                      
                      {/* Reason */}
                      <td className="py-4 px-4 text-muted-foreground max-w-[200px] truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      
                      {/* Attachment Icon */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-muted-foreground/50">—</span>
                        {/* Note: File upload logic will go here if added to schema later */}
                      </td>
                      
                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          leave.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                          leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                          {leave.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {leave.status === 'Approved' && <Check className="w-3.5 h-3.5" />}
                          {leave.status === 'Rejected' && <X className="w-3.5 h-3.5" />}
                          {leave.status}
                        </span>
                      </td>
                      
                      {/* Actions (Hover to reveal buttons logic) */}
                      <td className="py-4 px-4 text-right">
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleAction(leave.id, 'Approve')} 
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button 
                              onClick={() => handleAction(leave.id, 'Reject')} 
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground px-3">Processed</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeaves;