from django.core.mail import send_mail, EmailMessage
from django.http import FileResponse, Http404
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.serializers import ProfileSerializer

from datetime import datetime, timedelta
import locale

locale.setlocale(locale.LC_ALL, "")


def index(request):
    return render(request, "index.html", {})


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(requests):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    profile = user.profile_set.all()
    serializer = ProfileSerializer(profile, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def mail_era(request):
    try:
        res = send_mail(
            subject=f"Новая заявка от {request.data['company']}",
            message=f"Почта: {request.data['email']}\n" +
                    f"Управляющая организация: {request.data['company']}\n" +
                    f"Фактический адрес: {request.data['address']}\n" +
                    f"Контактное лицо: {request.data['fio']}\n" +
                    f"Телефон, Скайп, Zoom: {request.data['tele']}",
            from_email="no-reply@tech.orel-ecenter.ru",
            recipient_list=['jellymelly@inbox.ru'],
            fail_silently=False
        )
        if res == 1:
            today = datetime.now()
            five_days = timedelta(days=5)
            today += five_days
            email = EmailMessage(
                subject=f"Сообщение от 'ЭРА ЖКХ' для {request.data['company']}",
                body=f"{request.data['fio']}, здравствуйте!\n" +
                     "Благодарим за проявленный Вами интерес к программе.\n" +
                     "Просим ознакомиться с договором во вложении, особо обратив внимание на пункты 4.1, 4.2.\n" +
                     f"Мы обязательно свяжемся с Вами до {today.strftime('%d.%m.%Y (%A)')}\n" +
                     "С уважением, 'ЭРА ЖКХ'\n",
                from_email="no-reply@tech.orel-ecenter.ru",
                to=[request.data['email']]
            )
            email.attach_file('core/file/contract_offer.pdf')
            email.send()
        return Response({"res": "Ваша заявка успешно зарегестрирована. Проверьте почту" if (res == 1) else "Произошла ошибка отправки"})
    except:
        return Response({"res": "Произошла ошибка отправки"})


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_contract_offer(request):
    try:
        return FileResponse(open('core/file/contract_offer.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()
    except:
        print("Где файл, кожанный ублюдок")
