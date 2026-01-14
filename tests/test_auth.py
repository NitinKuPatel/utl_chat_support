import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_login_success(client):
    # Ensure super admin exists (fixture handles it if used, but here valid user needed)
    from app.users.services import bootstrap_super_admin
    await bootstrap_super_admin()

    response = await client.post("/auth/login", json={
        "email": settings.DEFAULT_SUPERADMIN_EMAIL,
        "password": settings.DEFAULT_SUPERADMIN_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_failure(client):
    response = await client.post("/auth/login", json={
        "email": settings.DEFAULT_SUPERADMIN_EMAIL,
        "password": "wrongpassword"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_refresh_token(client):
    # 1. Login
    from app.users.services import bootstrap_super_admin
    await bootstrap_super_admin()
    
    login_res = await client.post("/auth/login", json={
        "email": settings.DEFAULT_SUPERADMIN_EMAIL,
        "password": settings.DEFAULT_SUPERADMIN_PASSWORD
    })
    refresh_token = login_res.json()["refresh_token"]
    
    # 2. Refresh
    refresh_res = await client.post("/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["refresh_token"] != refresh_token # New token issued

@pytest.mark.asyncio
async def test_logout(client):
    # 1. Login
    from app.users.services import bootstrap_super_admin
    await bootstrap_super_admin()
    
    login_res = await client.post("/auth/login", json={
        "email": settings.DEFAULT_SUPERADMIN_EMAIL,
        "password": settings.DEFAULT_SUPERADMIN_PASSWORD
    })
    refresh_token = login_res.json()["refresh_token"]
    
    # 2. Logout
    logout_res = await client.post("/auth/logout", json={
        "refresh_token": refresh_token
    })
    assert logout_res.status_code == 200
    
    # 3. Try to refresh (should fail)
    refresh_fail = await client.post("/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_fail.status_code == 401
