import { Tag } from "./tag";

export function Tags({ tags }: { tags: string[] }) {
  return <>{tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}</>;
}
