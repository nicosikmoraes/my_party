# FILE: app/Http/Controllers/TestController.php
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Display a test message.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'message' => 'Hello from TestController!',
            'user' => auth()->user() ? auth()->user()->name : 'Guest'
        ]);
    }
}
```

# FILE: routes/api.php
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\TestController; // Add this line

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Test Route (Add this line)
    Route::get('/test', [TestController::class, 'index']);
});
```

# FILE: app/screens/TestScreen.tsx
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router'; // Assuming expo-router for navigation stack header

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Test Screen' }} />
      <Text style={styles.title}>Hello from TestScreen!</Text>
      <Text style={styles.subtitle}>This is a basic test screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default TestScreen;
```