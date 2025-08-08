export interface UserReview {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  commentary: string;
  calification: number;
  created_at: string;
  updated_at: string;
  request_id: string;
  reviewer_name?: string;
  reviewer_image?: string;
  reviewer_membership_json?: {
    isPro: boolean;
    endDate: Date | null;
    startingDate: Date | null;
  };
}

// Tipo para la respuesta de Supabase
export interface SupabaseReview extends Omit<UserReview, 'reviewer_name' | 'reviewer_image' | 'reviewer_membership_json'> {
  reviewer: {
    id: string;
    name: string;
    last_name: string;
    profile_pic: string;
    membership_json: {
      isPro: boolean;
      endDate: Date | null;
      startingDate: Date | null;
    };
  } | null;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  reviewerMembershipJson?: {
    isPro: boolean;
    endDate: Date | null;
    startingDate: Date | null;
  };
  rating: number;
  reviewerId: string; 
  comment?: string;
  date: string;
}

export interface ProfileReviewsProps {
  userName: string;
  averageRating: number;
  profileImage?: string;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1-5 stars -> count
  };
  reviews: Review[];
  onViewMoreReviews?: () => void;
  isLoadingMore?: boolean;
}
