"use client";

// INTERFACES
import { RequestInfos, RequestStatus } from "@/interfaces/request";

// LIBRARIES
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  Database,
  Filter,
  Loader2,
  Map,
  Search,
} from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { requests_services } from "@/services/requests.services";

// COMPONENTS
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import RequestCard from "./_components/RequestCard";
import RequestDialog from "./_components/RequestForm";

// CONSTANTS
const sort_options = [
  { value: "recent", label: "Most recent" },
  { value: "popular", label: "Most upvoted" },
];

const status_options = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "validated", label: "Validated" },
];

/*======= COMPONENT =======*/
export default function RequestsPageClient() {
  /*------- STATE -------*/
  const [requests, set_requests] = useState<RequestInfos[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [is_loading_more, set_is_loading_more] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const [search_query, set_search_query] = useState("");
  const [debounced_search_query, set_debounced_search_query] = useState("");
  const [selected_status, set_selected_status] = useState<string>("all");
  const [selected_tags, set_selected_tags] = useState<string[]>([]);
  const [sort_by, set_sort_by] = useState<string>("popular");

  // Pagination state
  const [page, set_page] = useState(1);
  const [has_more, set_has_more] = useState(true);
  const [total_pages, set_total_pages] = useState(1);

  // Reference to observe the last request element
  const observer = useRef<IntersectionObserver | null>(null);
  const last_request_element_ref = useCallback(
    (node: HTMLDivElement) => {
      if (is_loading_more) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && has_more) {
          load_more_requests();
        }
      });

      if (node) observer.current.observe(node);
    },
    [is_loading_more, has_more]
  );

  /*------- EFFECTS -------*/
  useEffect(() => {
    const timeout_id = setTimeout(() => {
      set_debounced_search_query(search_query);
    }, 500);

    return () => clearTimeout(timeout_id);
  }, [search_query]);

  /*------- METHODS -------*/
  const fetch_requests = async (reset: boolean = true) => {
    try {
      if (reset) {
        set_is_loading(true);
        set_page(1);
      } else {
        set_is_loading_more(true);
      }

      const current_page = reset ? 1 : page;
      const status_param =
        selected_status !== "all" ? selected_status : undefined;

      const response = await requests_services.get_requests_async(
        current_page,
        9, // Items per page
        status_param,
        selected_tags.length > 0 ? selected_tags : undefined,
        debounced_search_query || undefined,
        sort_by
      );

      const { requests: fetched_requests, pagination } = response;

      // Sort requests by priority: open → fulfilled → validated
      const sorted_requests = [...fetched_requests].sort((a, b) => {
        // First priority: open requests
        if (
          a.request.status === RequestStatus.OPEN &&
          b.request.status !== RequestStatus.OPEN
        )
          return -1;
        if (
          a.request.status !== RequestStatus.OPEN &&
          b.request.status === RequestStatus.OPEN
        )
          return 1;

        // Second priority: fulfilled but not validated
        if (
          a.request.status === RequestStatus.SUBMITTED &&
          !a.request.is_validated &&
          b.request.status === RequestStatus.SUBMITTED &&
          b.request.is_validated
        )
          return -1;
        if (
          a.request.status === RequestStatus.SUBMITTED &&
          a.request.is_validated &&
          b.request.status === RequestStatus.SUBMITTED &&
          !b.request.is_validated
        )
          return 1;

        // Maintain original sort order for equal priority
        return 0;
      });

      if (reset) {
        set_requests(sorted_requests);
      } else {
        set_requests((prev) => [...prev, ...sorted_requests]);
      }

      set_has_more(pagination.has_next);
      set_total_pages(pagination.total_pages);
      set_page(current_page);
      set_error(null);
    } catch (error: any) {
      set_error(error.message || "Failed to fetch dataset requests");
      toast({
        title: "Error",
        description: "Failed to fetch dataset requests",
        variant: "destructive",
      });
    } finally {
      set_is_loading(false);
      set_is_loading_more(false);
    }
  };

  const load_more_requests = () => {
    if (!has_more || is_loading_more) return;
    set_page((prev) => prev + 1);
  };

  const handle_sort_change = (new_sort: string) => {
    if (new_sort === sort_by) return;
    set_sort_by(new_sort);
  };

  const handle_status_change = (new_status: string) => {
    if (new_status === selected_status) return;
    set_selected_status(new_status);
  };

  const handle_submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch_requests(true);
  };

  const handle_request_created = () => {
    // Refresh the list when a new request is created
    fetch_requests(true);
  };

  // Effects
  useEffect(() => {
    fetch_requests(true);
  }, [sort_by, debounced_search_query, selected_status, selected_tags]);

  useEffect(() => {
    if (page > 1) {
      fetch_requests(false);
    }
  }, [page]);

  /*------- RENDERER -------*/
  return (
    <div className="container min-h-full mx-auto bg-background-primary px-4 py-8 flex flex-col space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-y-8">
        {/* Title & nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-y-8">
          <h1 className="text-3xl font-bold">Dataset Requests</h1>

          {/* FAKE NAV */}
          <div className="w-full md:w-auto h-10 flex items-center rounded-md">
            {/* hub */}
            <Link
              href="/hub"
              className="w-full md:w-auto px-4 py-2 flex items-center justify-center text-sm font-medium text-foreground whitespace-nowrap border border-input bg-background-primary first:rounded-l-md last:rounded-r-md -ml-[1px] first:ml-0 hover:bg-hover hover:text-hover-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Map className="w-4 h-4 mr-2" />
              Maps
            </Link>

            {/* requests (current page) */}
            <span className="px-4 py-2 flex items-center justify-center text-sm font-medium whitespace-nowrap border border-input first:rounded-l-md last:rounded-r-md -ml-[1px] first:ml-0 bg-active text-active-foreground cursor-pointer">
              <Database className="w-4 h-4 mr-2" />
              Dataset Requests
            </span>
          </div>
        </div>

        <RequestDialog on_request_created={handle_request_created} />

        {/* Searchbar */}
        <div className="flex flex-col gap-y-4">
          <form onSubmit={handle_submit} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              className="pl-9"
            />
          </form>

          {/* Filters */}
          <div className="flex flex-col md:flex-row flex-wrap justify-end gap-y-4 md:gap-4">
            {/* Status */}
            <div className="flex items-center gap-x-2">
              <span className="flex items-center text-sm text-muted-foreground">
                <Filter className="w-4 h-4 mr-1" />
                Status :
              </span>

              <Select
                value={selected_status}
                onValueChange={handle_status_change}
              >
                <SelectTrigger className="w-full md:w-32 sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {status_options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-muted-foreground">
                <ArrowDownUp className="w-4 h-4 mr-1" />
                Sort :
              </span>

              <Select value={sort_by} onValueChange={handle_sort_change}>
                <SelectTrigger className="w-full md:w-32 sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sort_options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* LOADER */}
      {is_loading && requests.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* CONTENT */}
      {!is_loading && !error && (
        <>
          {requests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>
                    No dataset requests found.
                    {search_query && <span> Try different search terms.</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {requests.map((request, index) => {
                // Add ref to the last element for infinite scrolling
                const is_last_element = index === requests.length - 1;

                return (
                  <div
                    key={request.request.id}
                    ref={is_last_element ? last_request_element_ref : undefined}
                  >
                    <RequestCard request_infos={request} />
                  </div>
                );
              })}
            </div>
          )}

          {/* LOADING MORE INDICATOR */}
          {is_loading_more && (
            <div className="flex justify-center my-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* NO MORE CONTENT */}
          {!has_more && requests.length > 0 && (
            <div className="text-center text-muted-foreground my-6">
              <p>No more requests to load</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
