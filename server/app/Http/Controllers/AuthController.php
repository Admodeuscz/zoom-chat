<?php

namespace App\Http\Controllers;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Operator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Traits\HasApiResponses;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    use HasApiResponses;

    protected function generateRefreshToken($user)
    {
        return JWTAuth::claims(['refresh' => true])->fromUser($user);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'op_id' => 'required|string|max:32|unique:operators',
            'op_name' => 'required|string|max:64',
            'op_name_kana' => 'nullable|string|max:64',
            'pwd' => 'required|string|min:6',
            'team_id' => 'nullable|exists:teams,team_id'
        ]);

        if ($validator->fails()) {
            return $this->responseApi($validator->errors(), false, 422);
        }

        $operator = Operator::create([
            'op_id' => $request->op_id,
            'op_name' => $request->op_name,
            'op_name_kana' => $request->op_name_kana,
            'pwd' => Hash::make($request->pwd),
            'team_id' => $request->team_id
        ]);

        $token = Auth::login($operator);
        $refreshToken = $this->generateRefreshToken($operator);
        $operator = Operator::with('team')->find($operator->op_id);

        return $this->responseApi([
            'operator' => $operator,
            'access_token' => $token,
            'refresh_token' => $refreshToken
            ],
            true,
            201
        );
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'op_id' => 'required|string',
            'pwd' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->responseApi($validator->errors(), false, 422);
        }

        $credentials = [
            'op_id' => $request->op_id,
            'password' => $request->pwd
        ];

        if (!$token = Auth::attempt($credentials)) {
            return $this->responseApi([
                'message' => 'Thông tin đăng nhập không chính xác',
            ], false, 401);
        }

        $refreshToken = $this->generateRefreshToken(Auth::user());
        $operator = Operator::with('team')->find(Auth::user()->op_id);

        return $this->responseApi([
            'operator' => $operator,
            'access_token' => $token,
            'refresh_token' => $refreshToken
        ], true, 200);
    }

    public function logout()
    {
        Auth::logout();
        return $this->responseApi([
            'message' => 'Đăng xuất thành công',
        ], true, 200);
    }

    public function me()
    {
        return $this->responseApi(Auth::user(), true, 200);
    }

    public function refresh(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->responseApi($validator->errors(), false, 422);
        }

        $refreshToken = $request->input('refresh_token');

        try {
            JWTAuth::setToken($refreshToken);
            if (!JWTAuth::getClaim('refresh')) {
                return $this->responseApi(['error' => 'Invalid refresh token'], false, 401);
            }
            $newToken = JWTAuth::refresh($refreshToken);
        } catch (JWTException $e) {
            return $this->responseApi(['error' => 'Could not refresh token'], false, 500);
        }

        return $this->responseApi([
            'access_token' => $newToken,
        ], true, 200);
    }
}
