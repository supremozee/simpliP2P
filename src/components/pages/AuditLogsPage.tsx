"use client";
import useGetAllLogsByUser from '@/hooks/useGetAllLogsByUser';
import useGetAllLogsForOrg from '@/hooks/useGetAllLogsForOrg';
import useGetUser from '@/hooks/useGetUser';
import useisOrgCreator from '@/hooks/useIsOrgCreator';
import useStore from '@/store';
import React from 'react';
import TableSkeleton from '../atoms/Skeleton/Table';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import { AuditLog } from '@/types';
import TableRow from '../molecules/TableRow';

const AuditLogsPage = () => {
  const { currentOrg } = useStore();
  const { user } = useGetUser();
  const { isOrgCreator } = useisOrgCreator();
  const logsForOrg = useGetAllLogsForOrg(currentOrg, 1, 50);
  const logsByUser = useGetAllLogsByUser(currentOrg, user?.data?.id || '', 1, 50);
  const logs = isOrgCreator() ? logsForOrg.data?.data?.logs ?? [] : logsByUser.data?.data?.logs ?? [];
    
  if(logsForOrg.isLoading || logsByUser.isLoading) return <TableSkeleton />;

  const headers = [
    "Timestamp",
    "User",
    "Roles",
    "Action Type",
    "Entity Type",
    "Changes Made",
    "Log ID",
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
        orgs.id,
      ]}
      index={index}
    />
  );

  return (
    <div className="bg-white p-4 h-auto rounded-[5px]">
      <div className="overflow-auto relative">
        <table className="w-full border overflow-x-auto">
          <TableHead headers={headers} />
          <TableBody data={logs}
           renderRow={renderRow}
            emptyMessage="No logs found." />
        </table>
      </div>
    </div>
  );
};

export default AuditLogsPage;