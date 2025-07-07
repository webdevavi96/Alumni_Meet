from django.apps import AppConfig


class AlumniAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Alumni_App"

    def ready(self):
        import Alumni_App.signals
