import DashboardPage from '@/components/pages/DashboardPage'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | SimpliP2P',
  description: 'Access your personalized dashboard on SimpliP2P. View your investments, track performance, and manage your account securely.',
  keywords: ['dashboard', 'SimpliP2P', 'investments', 'account management', 'performance tracking'],
  robots: 'index, follow',
  openGraph: {
    title: 'Dashboard | SimpliP2P',
    description: 'Your personalized dashboard for managing investments and tracking performance on SimpliP2P.',
    url: 'https://app.simplip2p.com/dashboard',
    siteName: 'SimpliP2P',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard | SimpliP2P',
    description: 'Manage your investments and track performance on SimpliP2P.',
  },
}

const page = () => {
  return (
    <DashboardPage/>
  )
}

export default page