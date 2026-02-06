"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Mic, X, Clock, MapPin, Car } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RECENT_SEARCHES, LOCATION_SUGGESTIONS } from "./data"
import type { SearchSuggestion } from "./types"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onLocationChange: (location: string) => void
  location: string
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onLocationChange,
  location,
  placeholder = "Search for cars...",
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [activeField, setActiveField] = useState<"search" | "location" | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setActiveField(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const generateSuggestions = (query: string, field: "search" | "location") => {
    if (field === "search") {
      const recentSuggestions: SearchSuggestion[] = RECENT_SEARCHES.filter((search) =>
        search.toLowerCase().includes(query.toLowerCase()),
      ).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: "recent" as const,
      }))

      return recentSuggestions.slice(0, 5)
    } else {
      const locationSuggestions: SearchSuggestion[] = LOCATION_SUGGESTIONS.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase()),
      ).map((loc, index) => ({
        id: `location-${index}`,
        text: loc,
        type: "location" as const,
      }))

      return locationSuggestions.slice(0, 5)
    }
  }

  const handleSearchFocus = () => {
    setActiveField("search")
    setShowSuggestions(true)
    setSuggestions(generateSuggestions(value, "search"))
  }

  const handleLocationFocus = () => {
    setActiveField("location")
    setShowSuggestions(true)
    setSuggestions(generateSuggestions(location, "location"))
  }

  const handleSearchChange = (newValue: string) => {
    onChange(newValue)
    if (activeField === "search") {
      setSuggestions(generateSuggestions(newValue, "search"))
    }
  }

  const handleLocationChangeInternal = (newValue: string) => {
    onLocationChange(newValue)
    if (activeField === "location") {
      setSuggestions(generateSuggestions(newValue, "location"))
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (activeField === "search") {
      onChange(suggestion.text)
    } else if (activeField === "location") {
      onLocationChange(suggestion.text)
    }
    setShowSuggestions(false)
    setActiveField(null)
  }

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "recent":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "location":
        return <MapPin className="h-4 w-4 text-muted-foreground" />
      default:
        return <Car className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder={placeholder}
            className="pl-10 pr-20 h-12 rounded-r-none sm:rounded-r-none border-r-0 sm:border-r-0"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {value && (
              <Button variant="ghost" size="sm" onClick={() => onChange("")} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Mic className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Location Input */}
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={location}
            onChange={(e) => handleLocationChangeInternal(e.target.value)}
            onFocus={handleLocationFocus}
            placeholder="Location"
            className="pl-10 h-12 rounded-l-none sm:rounded-l-none border-l-0 sm:border-l-0"
          />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3 transition-colors"
            >
              {getSuggestionIcon(suggestion.type)}
              <span className="text-sm">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
