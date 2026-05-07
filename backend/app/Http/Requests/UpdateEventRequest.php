<?php

namespace App\Http\Requests;

use App\Enums\EventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->event->created_by_user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(EventType::class)],
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
            'address' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'date.date_format' => 'A data e hora do evento deve estar no formato AAAA-MM-DD HH:MM:SS.',
        ];
    }
}