
import React from 'react';
import { useJobMarket } from './job-market/useJobMarket';
import JobMarketHeader from './job-market/JobMarketHeader';
import SavedJobsSection from './job-market/SavedJobsSection';
import JobSearchForm from './job-market/JobSearchForm';
import JobResultsSection from './job-market/JobResultsSection';
import FeaturedJobsSection from './job-market/FeaturedJobsSection';

const JobMarket: React.FC = () => {
  const {
    jobs,
    loading,
    searchQuery,
    location,
    remoteOnly,
    totalJobs,
    dataSources,
    savedJobs,
    savedJobsData,
    setSearchQuery,
    setLocation,
    setRemoteOnly,
    searchJobs,
    saveJob,
    getTimeAgo,
    handleKeyPress,
    getDataSourceIcon,
    getDataSourceText,
    getSourceBadgeColor,
    cleanDescription
  } = useJobMarket();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <JobMarketHeader 
        dataSources={dataSources}
        totalJobs={totalJobs}
      />

      <SavedJobsSection
        savedJobsData={savedJobsData}
        onSaveJob={saveJob}
        getTimeAgo={getTimeAgo}
        cleanDescription={cleanDescription}
      />

      <JobSearchForm
        searchQuery={searchQuery}
        location={location}
        remoteOnly={remoteOnly}
        loading={loading}
        onSearchQueryChange={setSearchQuery}
        onLocationChange={setLocation}
        onRemoteOnlyChange={setRemoteOnly}
        onSearch={searchJobs}
        onKeyPress={handleKeyPress}
      />

      <JobResultsSection
        jobs={jobs}
        totalJobs={totalJobs}
        dataSources={dataSources}
        savedJobs={savedJobs}
        onSaveJob={saveJob}
        getTimeAgo={getTimeAgo}
        getDataSourceIcon={getDataSourceIcon}
        getDataSourceText={getDataSourceText}
        getSourceBadgeColor={getSourceBadgeColor}
        cleanDescription={cleanDescription}
      />

      <FeaturedJobsSection />
    </div>
  );
};

export default JobMarket;
