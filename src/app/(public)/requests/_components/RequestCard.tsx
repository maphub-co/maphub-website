"use client";

// INTERFACES
import { RequestInfos, RequestStatus } from "@/interfaces/request";

// LIBRARIES
import Link from "next/link";

// SERVICES
import { get_relative_time_string } from "@/utils/time.utils";

// UTILS
import { truncate_text } from "@/utils/string.utils";

// COMPONENTS
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { UpvoteButton } from "./UpvoteButton";

/*======= COMPONENT =======*/
export default function RequestCard({
  request_infos,
}: {
  request_infos: RequestInfos;
}) {
  /*------- ATTRIBUTES -------*/
  const { request } = request_infos;

  /*------- METHODS -------*/
  const get_status_badge = (status: RequestStatus) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="default" className="mb-0">
            Open
          </Badge>
        );
      case "submitted":
        return request.is_validated ? (
          <Badge className="bg-emerald-600 mb-0">Validated</Badge>
        ) : (
          <Badge className="bg-amber-500 mb-0">Submitted</Badge>
        );
      case "closed":
        return (
          <Badge variant="destructive" className="mb-0">
            Closed
          </Badge>
        );
      default:
        return <Badge className="mb-0">Unknown</Badge>;
    }
  };

  /*------- RENDER -------*/
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 relative">
      <Link className="absolute inset-0 z-1" href={`/requests/${request.id}`} />

      {/* HEADER */}
      <CardHeader className="flex flex-row items-center">
        {/* STATUS */}
        {get_status_badge(request.status as RequestStatus)}

        {/* LAST UPDATE */}
        <span className="text-xs text-muted-foreground mx-1 mb-0">
          • {get_relative_time_string(request.updated_at)} ago.
        </span>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="px-4 py-2 flex-grow">
        <CardTitle className="text-lg md:text-xl font-bold">
          {truncate_text(request.title, 60)}
        </CardTitle>

        <p className="text-muted-foreground text-sm mb-4">
          {truncate_text(request.description, 150)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {request.tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {request.tags.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{request.tags.length - 4} more
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-4 py-2 border-t flex flex-wrap justify-between gap-y-2">
        {/* UPVOTE BUTTON */}
        <UpvoteButton className="relative z-10" request_infos={request_infos} />

        {/* SUBMITTED MAP LINK */}
        {request.submitted_map_id && (
          <Link
            href={`/map/${request.submitted_map_id}`}
            className="btn btn-outline btn-size-default relative z-10"
          >
            {request.is_validated ? "See dataset" : "Check submission"}
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
