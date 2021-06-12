import { News } from "./news.model";

export interface HeadlineResponse {
  articles: News[];
  status: string;
  totalResults: number;
}
