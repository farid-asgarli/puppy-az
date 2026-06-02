FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5005

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/PetWebsite.API/PetWebsite.API.csproj", "PetWebsite.API/"]
COPY ["src/PetWebsite.Application/PetWebsite.Application.csproj", "PetWebsite.Application/"]
COPY ["src/PetWebsite.Domain/PetWebsite.Domain.csproj", "PetWebsite.Domain/"]
COPY ["src/PetWebsite.Infrastructure/PetWebsite.Infrastructure.csproj", "PetWebsite.Infrastructure/"]
COPY ["src/Common.Repository/Common.Repository.csproj", "Common.Repository/"]
RUN dotnet restore "PetWebsite.API/PetWebsite.API.csproj"

COPY src/ .
WORKDIR /src/PetWebsite.API
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PetWebsite.API.dll"]
