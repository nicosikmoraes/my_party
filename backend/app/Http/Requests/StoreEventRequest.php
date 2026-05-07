<?php

namespace App\Http\Requests;

use App\Enums\EventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'participants' => ['nullable', 'array'],
            'participants.*' => ['exists:users,id', Rule::notIn([$this->user()->id])],
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
            'participants.*.exists' => 'Um dos participantes selecionados não é um usuário válido.',
            'participants.*.not_in' => 'Você não pode se adicionar como participante.',
            'date.date_format' => 'A data e hora do evento deve estar no formato AAAA-MM-DD HH:MM:SS.',
        ];
    }
}