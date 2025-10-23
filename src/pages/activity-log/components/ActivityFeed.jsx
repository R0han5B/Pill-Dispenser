import React, { useState } from 'react';
import ActivityEntry from './ActivityEntry';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, loading, onLoadMore, hasMore }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
  };

  const closeDetails = () => {
    setSelectedActivity(null);
  };

  if (loading && activities?.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-shimmer w-3/4"></div>
                <div className="h-3 bg-muted rounded animate-shimmer w-1/2"></div>
                <div className="h-3 bg-muted rounded animate-shimmer w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Activity" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Activities Found</h3>
        <p className="text-muted-foreground mb-6">
          No activity records match your current filters. Try adjusting your search criteria or check back later.
        </p>
        <Button variant="outline" iconName="RefreshCw" iconPosition="left">
          Refresh Activities
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <ActivityEntry
            key={activity?.id}
            activity={activity}
            onViewDetails={handleViewDetails}
          />
        ))}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={onLoadMore}
              loading={loading}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Load More Activities
            </Button>
          </div>
        )}

        {!hasMore && activities?.length > 10 && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              You've reached the end of the activity log
            </p>
          </div>
        )}
      </div>
      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1100 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Activity Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDetails}
                iconName="X"
              >
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Event Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Event Type:</span>
                    <p className="font-medium text-foreground">{selectedActivity?.eventType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium text-foreground capitalize">{selectedActivity?.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp:</span>
                    <p className="font-medium text-foreground">
                      {new Date(selectedActivity.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                  {selectedActivity?.deviceId && (
                    <div>
                      <span className="text-muted-foreground">Device ID:</span>
                      <p className="font-medium text-foreground">{selectedActivity?.deviceId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient & Medication Details */}
              {(selectedActivity?.patientName || selectedActivity?.medicationName) && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Patient & Medication</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {selectedActivity?.patientName && (
                      <div>
                        <span className="text-muted-foreground">Patient:</span>
                        <p className="font-medium text-foreground">{selectedActivity?.patientName}</p>
                      </div>
                    )}
                    {selectedActivity?.medicationName && (
                      <div>
                        <span className="text-muted-foreground">Medication:</span>
                        <p className="font-medium text-foreground">{selectedActivity?.medicationName}</p>
                      </div>
                    )}
                    {selectedActivity?.dosage && (
                      <div>
                        <span className="text-muted-foreground">Dosage:</span>
                        <p className="font-medium text-foreground">{selectedActivity?.dosage}</p>
                      </div>
                    )}
                    {selectedActivity?.scheduleTime && (
                      <div>
                        <span className="text-muted-foreground">Scheduled Time:</span>
                        <p className="font-medium text-foreground">{selectedActivity?.scheduleTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Description</h3>
                <p className="text-sm text-foreground leading-relaxed bg-muted p-4 rounded-lg">
                  {selectedActivity?.description}
                </p>
              </div>

              {/* Additional Details */}
              {selectedActivity?.additionalData && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Additional Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs text-foreground whitespace-pre-wrap">
                      {JSON.stringify(selectedActivity?.additionalData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={closeDetails}>
                Close
              </Button>
              <Button variant="default" iconName="ExternalLink" iconPosition="left">
                View Related Records
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityFeed;