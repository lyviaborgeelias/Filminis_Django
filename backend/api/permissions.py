from rest_framework.permissions import BasePermission


class IsAdminPerfil(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "perfil")
            and request.user.perfil.tipo == "admin"
        )