import { useParams, useNavigate } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useListingById, ListingDetailsModal } from "@/features/listings";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const listingId = id ? Number(id) : undefined;
  const { data: listing, isLoading, error } = useListingById(listingId);

  const handleClose = () => {
    navigate("/listings");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <Result
        status="404"
        title="404"
        subTitle={t("listings.notFound", "Elan tapılmadı")}
        extra={
          <Button type="primary" onClick={handleClose}>
            {t("listings.backToList", "Elanlara qayıt")}
          </Button>
        }
      />
    );
  }

  return (
    <ListingDetailsModal open={true} listing={listing} onClose={handleClose} />
  );
}
