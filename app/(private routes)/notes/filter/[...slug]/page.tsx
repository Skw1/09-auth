import { fetchNotes } from '@/lib/api/serverApi';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const filter = params.slug?.[0] ?? 'all';
  const readableFilter =
    filter === 'all' ? 'All notes' : filter.charAt(0).toUpperCase() + filter.slice(1);

  return {
    title: `${readableFilter} | NoteHub`,
    description: `Notes filtered by: ${readableFilter}. View notes by selected category.`,
    openGraph: {
      title: `${readableFilter} | NoteHub`,
      description: `Notes filtered by: ${readableFilter}. View notes by selected category.`,
      url: `https://notehub.com/notes/filter/${filter}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

type NotesPageProps = {
  params: { slug: string[] };
};

export default async function NotesPage({ params }: NotesPageProps) {
  const tag = params.slug?.[0] === 'all' ? '' : params.slug?.[0] ?? '';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ search: '', page: 1, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
