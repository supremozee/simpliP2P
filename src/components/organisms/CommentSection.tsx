"use client";
import React, { useState } from "react";
import useCreateComment from "@/hooks/useCreateComment";
import useFetchSingleComment from "@/hooks/useFetchSingleComment";
import { FaPaperPlane } from "react-icons/fa";
import { AllComment } from "@/types";
import Button from "../atoms/Button";
import TextAreaField from "../atoms/TextArea";
import useStore from "@/store";

interface CommentComponentProps {
  entity_type: "purchase_order" | "purchase_requisition";
  entity_id: string;
}

const CommentSection: React.FC<CommentComponentProps> = ({
  entity_type,
  entity_id,
}) => {
  const { currentOrg } = useStore();
  const [commentText, setCommentText] = useState<string>("");
  const {
    createComment,
    loading: commentLoading,
    errorMessage: commentError,
  } = useCreateComment();
  const { data, isLoading, isError } = useFetchSingleComment(
    currentOrg,
    entity_id
  );

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await createComment(
      { entity_type, entity_id, text: commentText },
      currentOrg
    );
    setCommentText("");
  };

  const comments = data || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-primary font-bold text-sm mb-2">Comments</h3>
        {isLoading ? (
          <p className="text-sm text-foreground">Loading comments...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Error loading comments.</p>
        ) : comments.length > 0 ? (
          comments.map((comment: AllComment) => (
            <div key={comment?.id} className="p-2 bg-tertiary rounded-sm">
              <p className="text-sm text-foreground font-bold">{comment?.text}</p>
              <p className="text-xs text-foreground/90 mt-1">
                By @
                {comment?.created_by?.first_name +
                  " " +
                  comment?.created_by?.last_name}{" "}
                on {new Date(comment?.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-foreground">No comments yet.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <TextAreaField
          name="comment"
          label="Your Comment"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-2 border border-tertiary rounded-md text-sm resize-none"
          rows={3}
        />
        <Button
          className="absolute top-16 right-1 bg-white text-white px-4 py-2 rounded-md flex items-center gap-2 self-end"
          onClick={handleAddComment}
          disabled={commentLoading}
        >
          <FaPaperPlane size={14} color="black" />
          <span className="text-[12px] text-primary">Send</span>
        </Button>
        {commentError && (
          <p className="text-red-600 text-xs mt-2">{commentError}</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
