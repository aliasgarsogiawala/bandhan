"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Building2, MapPin } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import type { Destination, TourPackage } from "@/data/mockData";
import { buildPlaceIndex, matchPlaces, type PlaceSuggestion } from "@/lib/placeSuggestions";

interface PlaceSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onSelect"> {
  value: string;
  onValueChange: (value: string) => void;
  /** A suggestion was chosen; callers usually run the search straight away. */
  onPick: (place: PlaceSuggestion) => void;
}

type MenuPosition = { top: number; left: number; width: number; maxHeight: number };

/**
 * Text input with a destinations-and-cities dropdown ("M" -> Munnar, Madurai…).
 * The menu is portalled with fixed positioning because both hero bands clip
 * their overflow, which would cut an absolutely positioned menu off.
 */
export function PlaceSearchInput({ value, onValueChange, onPick, onFocus, onBlur, onKeyDown, ...inputProps }: PlaceSearchInputProps) {
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const index = useMemo(() => buildPlaceIndex(packages, destinations), [packages, destinations]);
  const matches = useMemo(() => matchPlaces(index, value), [index, value]);
  const options = [...matches.destinations, ...matches.cities];
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const expanded = open && options.length > 0 && position !== null;

  const measure = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 256),
      maxHeight: Math.max(160, Math.min(360, window.innerHeight - rect.bottom - 24)),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  const show = () => {
    measure();
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setActive(-1);
  };
  const pick = (place: PlaceSuggestion) => {
    onValueChange(place.label);
    hide();
    onPick(place);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
      event.preventDefault();
      show();
      const last = options.length - 1;
      const down = event.key === "ArrowDown";
      setActive((current) => (down ? (current >= last ? 0 : current + 1) : current <= 0 ? last : current - 1));
    } else if (event.key === "Enter" && expanded && active >= 0) {
      event.preventDefault();
      pick(options[active]);
    } else if (event.key === "Escape" && open) {
      hide();
    }
    onKeyDown?.(event);
  };

  const optionId = (position: number) => `${listId}-option-${position}`;
  const group = (label: string, places: PlaceSuggestion[], offset: number, Icon: typeof MapPin) =>
    places.length ? (
      <div role="group" aria-label={label}>
        <div role="presentation" className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
          {label}
        </div>
        {places.map((place, index) => {
          const position = offset + index;
          return (
            <div
              key={place.label}
              id={optionId(position)}
              role="option"
              aria-selected={active === position}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(position)}
              onClick={() => pick(place)}
              className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors ${active === position ? "bg-sand" : ""}`}
            >
              <Icon size={14} className="shrink-0 text-accent" aria-hidden="true" />
              {place.label}
            </div>
          );
        })}
      </div>
    ) : null;

  return (
    <>
      <input
        {...inputProps}
        ref={inputRef}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          setActive(-1);
          show();
        }}
        onFocus={(event) => {
          show();
          onFocus?.(event);
        }}
        onBlur={(event) => {
          hide();
          onBlur?.(event);
        }}
        onKeyDown={handleKeyDown}
      />
      {expanded && position
        ? createPortal(
            <div
              id={listId}
              role="listbox"
              aria-label="Destinations and cities"
              style={{ top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight }}
              className="fixed z-[70] overflow-y-auto rounded-lg border border-primary/10 bg-white pb-2 text-left shadow-[0_18px_50px_-20px_rgba(3,12,23,0.55)]"
            >
              {group("Destinations", matches.destinations, 0, MapPin)}
              {group("Cities", matches.cities, matches.destinations.length, Building2)}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default PlaceSearchInput;
