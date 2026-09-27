import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import RsvpForm from './RsvpForm'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  const isPast = new Date(event.date) < new Date()

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Events</span>
      </Link>

      <div className="card-warm overflow-hidden shadow-xs">
        {event.image_url && (
          <div className="w-full h-64 sm:h-96 relative bg-warm-secondary border-b border-warm">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4">
              <span className="badge-pill bg-warm-surface/95 backdrop-blur-xs text-xs font-bold">
                {isPast ? 'COMPLETED' : 'OPEN REGISTRATION'}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[11px] font-bold tracking-wider uppercase mb-4">
                <span>E-CELL | UIET MDU ROHTAK · EVENT</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-primary mb-5 leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-5 text-xs font-semibold text-warm-secondary mb-8 p-4 bg-warm-secondary rounded-2xl border border-warm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-accent" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-accent" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-warm-primary mb-3">
                  About the Event
                </h2>
                <p className="whitespace-pre-wrap text-sm sm:text-base text-warm-secondary leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-88 shrink-0">
              <div className="sticky top-24 bg-warm-surface border border-warm rounded-2xl p-6 shadow-2xs">
                <h3 className="text-base font-extrabold text-warm-primary mb-1 text-center">
                  {isPast ? 'Event Concluded' : 'Direct Event Registration'}
                </h3>
                <p className="text-xs text-warm-muted text-center mb-5">
                  {isPast
                    ? 'Registrations for this event have closed.'
                    : 'Instant student registration — no login required.'}
                </p>

                {isPast ? (
                  <div className="text-center p-4 rounded-xl bg-warm-secondary border border-warm text-warm-secondary text-xs font-medium">
                    This event has already taken place. Explore upcoming sessions on the Events page.
                  </div>
                ) : event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-primary w-full py-3 px-4 text-xs font-semibold justify-center"
                  >
                    <span>Register on External Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
