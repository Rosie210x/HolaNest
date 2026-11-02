import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, GraduationCap, Radius, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SCHOOLS } from '@/lib/schools';

// BR14 radius values
const RADII = ['1', '2', '3', '5'];

// A white segment inside the yellow frame: small visible label on top, the control below (no placeholder-only labels, §6.1)
function Segment({ icon: Icon, label, htmlFor, className, children }) {
  return (
    <div
      className={cn(
        'relative flex h-14 min-w-0 items-center gap-3 rounded-md bg-card px-3 text-card-foreground focus-within:ring-2 focus-within:ring-primary',
        className
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col">
        <label htmlFor={htmlFor} className="text-caption text-muted-foreground">
          {label}
        </label>
        {children}
      </div>
    </div>
  );
}

const controlClass =
  'w-full min-w-0 appearance-none bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:text-muted-foreground';

// Hero search (§4.1): keyword · school · radius · submit inside a 4 px yellow frame.
// Stacks on mobile; one row from lg. Writes the query string (§3.4) and drops empty fields.
export default function SearchBar({ className }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [school, setSchool] = useState(params.get('truong') ?? '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (value.trim()) {
        next.set(key, value.trim());
      }
    }
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <form
      role="search"
      aria-label="Tìm phòng"
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-1 rounded-lg bg-highlight p-1 shadow-md lg:flex-row', className)}
    >
      <Segment icon={Search} label="Từ khóa" htmlFor="search-q" className="lg:flex-[1.6]">
        <input
          id="search-q"
          name="q"
          type="search"
          minLength={2}
          defaultValue={params.get('q') ?? ''}
          placeholder="Khu vực, tên nhà trọ, tên đường"
          className={controlClass}
        />
      </Segment>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1 lg:flex lg:flex-1">
        <Segment icon={GraduationCap} label="Gần trường" htmlFor="search-school" className="lg:flex-1">
          <select
            id="search-school"
            name="truong"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            className={cn(controlClass, 'pr-6')}
          >
            <option value="">Bất kỳ</option>
            {SCHOOLS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
        </Segment>

        {/* Radius only means something once a school is chosen (BR14) */}
        <Segment icon={Radius} label="Bán kính" htmlFor="search-radius" className="w-36">
          <select
            id="search-radius"
            name="bk"
            disabled={!school}
            defaultValue={params.get('bk') ?? '3'}
            className={cn(controlClass, 'pr-6')}
          >
            {RADII.map((km) => (
              <option key={km} value={km}>
                ≤ {km} km
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
        </Segment>
      </div>

      <Button type="submit" size="lg" className="h-14 rounded-md lg:px-8">
        Tìm phòng
      </Button>
    </form>
  );
}
