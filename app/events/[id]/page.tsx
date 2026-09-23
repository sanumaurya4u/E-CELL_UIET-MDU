import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import RsvpForm from './RsvpForm'

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) {
    notFound()
  }

  const isPast = new Date(event.date) < new Date()

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 mb-20">
      <Link href="/events" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {event.image_url && (
          <div className="w-full h-64 sm:h-96 relative bg-slate-100">
            <Image 
              src={event.image_url} 
              alt={event.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-400 mb-8 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  {event.location}
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">About the Event</h3>
                <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="w-full md:w-80 shrink-0">
              <div className="sticky top-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-center">
                  {isPast ? 'Event has ended' : 'Join this Event'}
                </h3>
                
                {isPast ? (
                  <div className="text-center text-slate-500 text-sm">
                    This event is no longer accepting RSVPs.
                  </div>
                ) : event.registration_link ? (
                  <a 
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Register Externally
                  </a>
                ) : (
                  <RsvpForm eventId={event.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
