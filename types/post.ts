export type HeadingBlock = { type: "heading"; text: string; level: 2 | 3 | 4 };
export type ParagraphBlock = { type: "paragraph"; text: string };
export type ImageBlock = { type: "image"; image_url: string; caption?: string };
export type EmbedBlock = {
  type: "embed";
  url: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
    site_name?: string;
    platform?: string;
  };
};
export type VotingBlock = { type: "voting"; poll_id: string; question: string; options: string[] };
export type QuoteBlock = { type: "quote"; text: string; author?: string };
export type DividerBlock = { type: "divider" };

export type ContentBlock = 
  | HeadingBlock 
  | ParagraphBlock 
  | ImageBlock 
  | EmbedBlock 
  | VotingBlock 
  | QuoteBlock 
  | DividerBlock;

export type Post = {
  id: string;
  title: string;
  description: string;
  content?: string; // Stores serialized ContentBlock[] for news, plain text for legacy posts/other origins
  image: string;
  date: string;
  origin?: string;
  is_highlight?: boolean;
};
