"use client";

// INTERFACES
import { MapInfos } from "@/interfaces/map";

// LIBRARIES
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapIcon, Loader2Icon, Map, Database } from "lucide-react";
import Link from "next/link";

// SERVICES
import { maps_services } from "@/services/maps.services";

// COMPONENTS
import { Card, CardContent } from "@/components/ui/Card";
import MapCard from "@/components/maps/MapCard";
import Searchbar from "./_components/Searchbar";

export default function HubPageClient() {
  /*------- URL PARAMS -------*/
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL params
  const initialSearchQuery = searchParams.get("q") || "";
  const initialTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const initialSort = searchParams.get("sort") || "views";

  /*------- ATTRIBUTS -------*/
  const [maps, set_maps] = useState<MapInfos[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [is_loading_more, set_is_loading_more] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  // Search parameters - initialize from URL
  const [search_params, set_search_params] = useState({
    search_query: initialSearchQuery,
    selected_tags: initialTags,
    sort_by: initialSort,
  });

  // Pagination state
  const [page, set_page] = useState(1);
  const [has_more, set_has_more] = useState(true);
  const [total_pages, set_total_pages] = useState(1);

  // Reference to observe the last map element
  const observer = useRef<IntersectionObserver | null>(null);
  const last_map_element_ref = useCallback(
    (node: HTMLDivElement) => {
      if (is_loading_more) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && has_more) {
          load_more_maps();
        }
      });

      if (node) observer.current.observe(node);
    },
    [is_loading_more, has_more]
  );

  /*------- URL SYNC METHODS -------*/
  const updateSearchParams = (
    query: string,
    tags: string[],
    sortBy: string
  ) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (tags.length > 0) params.set("tags", tags.join(","));
    if (sortBy !== "views") params.set("sort", sortBy); // Only set if not default

    const newUrl = `/hub${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  // Debounced URL update for search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchParams(
        search_params.search_query,
        search_params.selected_tags,
        search_params.sort_by
      );
    }, 500); // Debounce search query URL updates

    return () => clearTimeout(timeoutId);
  }, [search_params.search_query]);

  // Immediate URL update for filters/sort
  useEffect(() => {
    updateSearchParams(
      search_params.search_query,
      search_params.selected_tags,
      search_params.sort_by
    );
  }, [search_params.selected_tags, search_params.sort_by]);

  /*------- SEARCH METHODS -------*/
  const handle_search_change = (params: {
    search_query: string;
    selected_tags: string[];
    sort_by: string;
  }) => {
    set_search_params(params);
  };

  /*------- METHODS -------*/
  const fetch_maps = async (reset: boolean = true) => {
    try {
      if (reset) {
        set_is_loading(true);
        set_page(1);
      } else {
        set_is_loading_more(true);
      }

      const currentPage = reset ? 1 : page;

      // If there's a search query or tags filter, use search functionality
      if (
        search_params.search_query ||
        search_params.selected_tags.length > 0
      ) {
        const results = await maps_services.search_maps_async({
          query: search_params.search_query,
          tags:
            search_params.selected_tags.length > 0
              ? search_params.selected_tags
              : undefined,
        });

        set_maps(results);
        set_has_more(false); // Search results don't support pagination yet
        set_error(null);
      } else {
        // Otherwise, use the regular paginated list
        const response = await maps_services.get_paginated_maps_async(
          search_params.sort_by,
          currentPage
        );

        const maps_list = response.maps;
        const pagination = response.pagination;

        if (reset) {
          set_maps(maps_list);
        } else {
          set_maps((prev) => [...prev, ...maps_list]);
        }

        set_has_more(pagination.has_next);
        set_total_pages(pagination.total_pages);
        set_page(currentPage);
        set_error(null);
      }
    } catch (error: any) {
      set_error(error.message || "Failed to fetch maps");
    } finally {
      set_is_loading(false);
      set_is_loading_more(false);
    }
  };

  const load_more_maps = () => {
    if (!has_more || is_loading_more) return;
    set_page((prev) => prev + 1);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    fetch_maps(true);
  }, [search_params]);

  useEffect(() => {
    if (page > 1) {
      fetch_maps(false);
    }
  }, [page]);

  /*------- RENDER -------*/
  return (
    <div className="container min-h-full mx-auto bg-background-primary px-4 py-8 flex flex-col space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-y-8">
        {/* Title & nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-y-8">
          <h1 className="text-3xl font-bold">Explore Maps</h1>

          {/* FAKE NAV */}
          <div className="w-full md:w-auto h-10 flex items-center rounded-md">
            {/* hub (current page) */}
            <span className="w-full md:w-auto px-4 py-2 flex items-center justify-center text-sm font-medium whitespace-nowrap border border-input first:rounded-l-md last:rounded-r-md -ml-[1px] first:ml-0 bg-active text-active-foreground cursor-pointer">
              <Map className="w-4 h-4 mr-2" />
              Maps
            </span>

            {/* requests */}
            <Link
              href="/requests"
              className="px-4 py-2 flex items-center justify-center text-sm font-medium text-foreground whitespace-nowrap border border-input bg-background-primary first:rounded-l-md last:rounded-r-md -ml-[1px] first:ml-0 hover:bg-hover hover:text-hover-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Database className="w-4 h-4 mr-2" />
              Dataset Requests
            </Link>
          </div>
        </div>

        {/* Searchbar */}
        <Searchbar
          on_change={handle_search_change}
          initial_search_query={search_params.search_query}
          initial_selected_tags={search_params.selected_tags}
          initial_sort_by={search_params.sort_by}
        />
      </div>

      {/* LOADER */}
      {is_loading && maps.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <Card className="bg-destructive/10 border-destructive mt-8">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* CONTENT */}
      {!is_loading &&
        !error &&
        (maps.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <MapIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                {search_params.search_query ||
                search_params.selected_tags.length > 0 ? (
                  <p>
                    No maps found matching your search criteria.
                    {search_params.search_query && (
                      <span> Try different keywords.</span>
                    )}
                    {search_params.selected_tags.length > 0 && (
                      <span> Try different tags.</span>
                    )}
                  </p>
                ) : (
                  <p>No maps available yet. Check back later!</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-y-8 md:gap-8 mt-8">
              {maps.map((map, index) => {
                // Add ref to the last element for infinite scrolling
                const is_last = index === maps.length - 1;

                return (
                  <div
                    key={map.id}
                    className={`
                      col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3
                      w-full
                    `}
                    ref={is_last ? last_map_element_ref : undefined}
                  >
                    <MapCard
                      id={map.id}
                      className="w-full h-full"
                      params={map}
                    />
                  </div>
                );
              })}
            </div>

            {is_loading_more && (
              <div className="flex justify-center my-6">
                <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!has_more && maps.length > 0 && (
              <div className="text-center text-muted-foreground my-6">
                <p>No more maps to load</p>
              </div>
            )}
          </>
        ))}
    </div>
  );
}
