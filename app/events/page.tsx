import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  const upcomingEvents = events?.filter(e => new Date(e.date) >= new Date()) || []
  const pastEvents = events?.filter(e => new Date(e.date) < new Date()) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CAMPUS CALENDAR • 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-warm-primary mb-4 leading-tight">
          E-Cell Events & <span className="text-orange-accent">Hackathons</span>
        </h1>
        <p className="text-base text-warm-secondary leading-relaxed">
          Join our workshops, founder talks, and hackathons to accelerate your entrepreneurial journey at UIET MDU.
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-warm">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-extrabold text-warm-primary">Upcoming Events</h2>
          <span className="badge-pill border-orange-accent/40 text-orange-accent text-xs font-bold">
            {upcomingEvents.length} Active
          </span>
        </div>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="p-14 border border-dashed border-warm rounded-2xl text-center bg-warm-surface mb-16">
          <div className="w-12 h-12 rounded-full bg-warm-secondary flex items-center justify-center mx-auto mb-4 text-warm-muted">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-warm-primary mb-1">No Upcoming Events Right Now</h3>
          <p className="text-sm text-warm-secondary max-w-sm mx-auto">
            We are preparing the next round of hackathons and founder sessions. Check back soon or register for announcements.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-warm pt-6">
            <h2 className="text-xl font-bold text-warm-muted">Past Events & Archives</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-85">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </>
      )}

    </div>
  )
}

function EventCard({ event, isPast }: { event: any; isPast?: boolean }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="card-warm overflow-hidden flex flex-col group transition-all"
    >
      <div className="aspect-video relative bg-warm-secondary overflow-hidden border-b border-warm">
        {event.image_url ? (
          <Image 
            src={event.image_url} 
            alt={event.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-warm-muted">
            <Calendar className="w-10 h-10 opacity-40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="badge-pill bg-warm-surface/90 backdrop-blur-xs text-[11px] font-bold">
            {isPast ? 'COMPLETED' : 'UPCOMING'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-warm-primary group-hover:text-orange-accent transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>
          <p className="text-xs text-warm-secondary line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-warm-muted pt-3 border-t border-warm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-orange-accent" />
            <span className="font-medium text-warm-secondary">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-accent" />
              <span className="truncate max-w-[180px]">{event.location}</span>
            </div>
            <span className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1">
              <span>View</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
