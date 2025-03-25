export interface Event {
  id: number;
  title: string;
  description: string;
  course: {
    id: number;
    title: string;
    photo: string;
  };
  flow: { id: number; name: string }[];
  status: "pending" | "canceled" | "completed" | "on_going";
  datetime: string;
  total_visitors: number;
  total_visited_students: number;
}
