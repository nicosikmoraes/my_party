<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Enums\Color;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',

            'shirt_size' => 'nullable|in:PP,P,M,G,GG',
            'shoe_size' => 'nullable|integer|min:20|max:50',
            'pants_size' => 'nullable|integer|min:30|max:60',
            'ring_size' => 'nullable|integer|min:8|max:40',
        ]);

        $user = User::create([
            'name' => strtolower($request->name),
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'shirt_size' => $request->shirt_size,
            'shoe_size' => $request->shoe_size,
            'pants_size' => $request->pants_size,
            'ring_size' => $request->ring_size,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $user = User::where('email', strtolower($request->email))->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Senha incorreta'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout realizado'
    ]);
    }

        public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Email enviado com sucesso'])
            : response()->json(['message' => 'Erro ao enviar email'], 400);
    }

        public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Senha redefinida com sucesso'])
            : response()->json(['message' => 'Token inválido ou expirado'], 400);
    }


    //LOGIN VIA GOOGLE
        public function googleLogin(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->userFromToken($request->token);

            $email = strtolower($googleUser->getEmail());

            if (!$email) {
                return response()->json([
                    'message' => 'Google account email not found'
                ], 401);
            }

            $user = User::where('email', $email)->first();

            if (!$user) {
                $baseName = $googleUser->getName() ?: explode('@', $email)[0];
                $name = $this->generateUniqueUsername($baseName);

                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make(Str::random(32)),
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Erro ao autenticar com Google',
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    private function generateUniqueUsername(string $name): string
    {
        $base = Str::slug(strtolower($name), '');

        if (!$base) {
            $base = 'user';
        }

        $username = $base;
        $counter = 1;

        while (User::where('name', $username)->exists()) {
            $username = $base . $counter;
            $counter++;
        }

        return $username;
    }

        public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'shirt_size' => 'nullable|in:PP,P,M,G,GG',
            'shoe_size' => 'nullable|integer',
            'pants_size' => 'nullable|integer',
            'ring_size' => 'nullable|integer',
            'preferred_color' => ['nullable', Rule::in(array_column(Color::cases(), 'value'))],
        ]);

        $user->update([
            'shirt_size' => $request->shirt_size,
            'shoe_size' => $request->shoe_size,
            'pants_size' => $request->pants_size,
            'ring_size' => $request->ring_size,
            'preferred_color' => $request->preferred_color,
        ]);

        return response()->json($user);
    }
}
