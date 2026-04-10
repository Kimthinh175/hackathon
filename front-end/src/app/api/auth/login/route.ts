import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'waremax-super-secret-key-for-jwt-2026';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập tài khoản và mật khẩu.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại hoặc bị khóa.' }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Mật khẩu sai.' }, { status: 401 });
    }

    // Sign JWT Token
    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // Set HTTP-Only Cookie
    const cookieSerialized = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/'
    });

    const headers = new Headers();
    headers.append('Set-Cookie', cookieSerialized);

    return NextResponse.json(
      { success: true, user: { username: user.username, role: user.role } },
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Lỗi kết nối máy chủ.' }, { status: 500 });
  }
}
