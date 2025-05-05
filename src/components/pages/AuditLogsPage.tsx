"use client";
import useGetAllLogsByUser from '@/hooks/useGetAllLogsByUser';
import useGetAllLogsForOrg from '@/hooks/useGetAllLogsForOrg';
import useGetUser from '@/hooks/useGetUser';
import useisOrgCreator from '@/hooks/useIsOrgCreator';
import useStore from '@/store';
import React, { useState } from 'react';
import TableSkeleton from '../atoms/Skeleton/Table';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import { AuditLog } from '@/types';
import TableRow from '../molecules/TableRow';
import ActionBar from '../molecules/ActionBar';
import TableShadowWrapper from '../atoms/TableShadowWrapper';

const AuditLogsPage = () => {
  const { currentOrg } = useStore();
  const { user } = useGetUser();
  const { isOrgCreator } = useisOrgCreator();
  const logsForOrg = useGetAllLogsForOrg(currentOrg, 1, 50);
  const logsByUser = useGetAllLogsByUser(currentOrg, user?.data?.id || '', 1, 50);
  const logs = isOrgCreator() ? logsForOrg.data?.data?.logs ?? [] : logsByUser.data?.data?.logs ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  if(logsForOrg.isLoading || logsByUser.isLoading) return <TableSkeleton />;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  }
  const matchesLog = 
    logs.filter((log: AuditLog) => {
      const logString = `${log.created_at} ${log.user.first_name} ${log.user.last_name} ${log.action} ${log.entity_type}`;
      return logString.toLowerCase().includes(searchQuery.toLowerCase());
    });
  const headers = [
    "Timestamp",
    "User",
    "Roles",
    "Action Type",
    "Entity Type",
    "Changes Made",
  ];

  const renderRow = (orgs: AuditLog, index: number) => (
    <TableRow
      key={orgs.id}
      data={[
        orgs.created_at.split('T')[0],
        `${orgs.user.first_name} ${orgs.user.last_name}`,
        orgs.user?.userOrganisations?.find((user) => user?.role !== "")?.role || '',
        orgs.action,
        orgs.entity_type.replaceAll("_", " ").toLowerCase(),
        orgs.description,
      ]}
      index={index}
    />
  );

  return (
    <div className="bg-white p-4 h-auto rounded-[5px]">
      <div className="overflow-auto relative">
        <ActionBar
        onSearch={handleSearch}
        showDate
        type='logs'
        />
        <TableShadowWrapper maxHeight='100vh'>
        <table className="w-full border overflow-x-auto">
          <TableHead headers={headers} />
          <TableBody data={matchesLog}
           renderRow={renderRow}
            emptyMessage="No logs found." />
        </table>
        </TableShadowWrapper>
      </div>
    </div>
  );
};

export default AuditLogsPage;