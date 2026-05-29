from rest_framework import permissions


class IsAdminPerfil(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        perfil = getattr(request.user, "perfil_usuario", None)

        if not perfil:
            return False

        return perfil.tipo == "admin"