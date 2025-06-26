import { NextResponse } from 'next/server';
import { middleware } from '@/middleware';

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn().mockImplementation(() => ({
      headers: {
        append: jest.fn(),
      },
    })),
  },
}));

describe('Middleware Tests', () => {
  let mockRequest: { headers: any; nextUrl: any };
  let mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: new Map(),
      nextUrl: { pathname: '/' },
    };

    mockResponse = {
      headers: {
        append: jest.fn(),
      },
    };

    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);
  });

  it('should append CORS headers for normal requests', () => {
    const response = middleware(mockRequest);

    expect(response.headers.append).toHaveBeenCalledWith(
      'Access-Control-Allow-Credentials',
      'true'
    );
    expect(response.headers.append).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      'GET,DELETE,PATCH,POST,PUT'
    );
    expect(response.headers.append).toHaveBeenCalledWith(
      'Access-Control-Allow-Headers',
      '*'
    );
  });

  it('should return NextResponse.next() for WebSocket requests', () => {
    mockRequest.headers.set('upgrade', 'websocket');

    const response = middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalledTimes(1);
    expect(response).toEqual(
      (NextResponse.next as jest.Mock).mock.results[0].value
    );
  });

  it('should return NextResponse.next() for internal Next.js routes', () => {
    mockRequest.nextUrl.pathname = '/_next/static/test.js';

    const response = middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalledTimes(1);
    expect(response).toEqual(
      (NextResponse.next as jest.Mock).mock.results[0].value
    );
  });
});
