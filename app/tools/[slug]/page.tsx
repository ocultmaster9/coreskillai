import React from 'react';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllTools } from '@/lib/toolsRegistry';
import ToolClient from './ToolClient';

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();
  return <ToolClient tool={tool!} />;
}
