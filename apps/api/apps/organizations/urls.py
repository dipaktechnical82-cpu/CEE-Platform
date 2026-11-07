from django.urls import path

from .views import (
    OrganizationBatchDetailView,
    OrganizationBatchListCreateView,
    OrganizationDetailView,
    OrganizationInvitationAcceptView,
    OrganizationInvitationListCreateView,
    OrganizationInvitationRevokeView,
    OrganizationListCreateView,
    OrganizationMembershipDetailView,
    OrganizationMembershipListCreateView,
)

app_name = "organizations"

urlpatterns = [
    path("", OrganizationListCreateView.as_view(), name="organization-list"),
    path("<uuid:organization_id>/", OrganizationDetailView.as_view(), name="organization-detail"),
    path(
        "<uuid:organization_id>/memberships/",
        OrganizationMembershipListCreateView.as_view(),
        name="membership-list",
    ),
    path(
        "memberships/<uuid:membership_id>/",
        OrganizationMembershipDetailView.as_view(),
        name="membership-detail",
    ),
    path(
        "<uuid:organization_id>/batches/",
        OrganizationBatchListCreateView.as_view(),
        name="batch-list",
    ),
    path(
        "batches/<uuid:batch_id>/",
        OrganizationBatchDetailView.as_view(),
        name="batch-detail",
    ),
    path(
        "<uuid:organization_id>/invitations/",
        OrganizationInvitationListCreateView.as_view(),
        name="invitation-list",
    ),
    path(
        "invitations/accept/",
        OrganizationInvitationAcceptView.as_view(),
        name="invitation-accept",
    ),
    path(
        "invitations/<uuid:invitation_id>/revoke/",
        OrganizationInvitationRevokeView.as_view(),
        name="invitation-revoke",
    ),
]
