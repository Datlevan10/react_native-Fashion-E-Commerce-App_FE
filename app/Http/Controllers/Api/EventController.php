<?php

namespace App\Http\Controllers\Api;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    // method GET
    public function index() {
        $events = Event::get();
        if ($events->count() > 0) {
            return response()->json([
                'message' => 'Get events success',
                'data' => EventResource::collection($events)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // Method POST
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_name' => 'required|string',
            'description' => 'nullable|string',
            'event_image' => 'nullable|array',
            'event_image.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        // Handle event image upload
        $imagePaths = [];
        if ($request->hasFile('event_image')) {
            foreach ($request->file('event_image') as $imageFile) {
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imagePath = $imageFile->storeAs('events', $imageName, 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
        }

        $event = Event::create([
            'event_name' => $request->event_name,
            'description' => $request->description,
            'event_image' => $imagePaths,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->input('is_active', true),
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'data' => new EventResource($event)
        ], 201);
    }

    // method GET Detail event event_id
    public function show($event_id) {
        try {
            $event = Event::where('event_id', $event_id)->first();
            if (!$event) {
                return response()->json([
                    'message' => 'Event not found',
                    'event_id' => $event_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get event success with event_id',
                'data' => new EventResource($event)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get event information', [
                'error' => $e->getMessage(),
                'event_id' => $event_id
            ]);

            return response()->json([
                'message' => 'Failed to get event information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Method to get all active events
    public function getActiveEvents()
    {
        $events = Event::where('is_active', true)->get();

        if ($events->count() > 0) {
            return response()->json([
                'message' => 'Active events retrieved successfully',
                'data' => $events
            ], 200);
        }

        return response()->json(['message' => 'No active events found'], 200);
    }

    // Method to get all inactive events
    public function getInactiveEvents()
    {
        $events = Event::where('is_active', false)->get();

        if ($events->count() > 0) {
            return response()->json([
                'message' => 'Inactive events retrieved successfully',
                'data' => $events
            ], 200);
        }

        return response()->json(['message' => 'No inactive events found'], 200);
    }

    // Method PUT
    public function update(Request $request, $event_id)
    {
        $validator = Validator::make($request->all(), [
            'event_name' => 'sometimes|string',
            'description' => 'sometimes|nullable|string',
            'event_image' => 'sometimes|array',
            'event_image.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $event = Event::find($event_id);
        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
                'event_id' => $event_id
            ], 404);
        }

        // Handle event image upload
        $imagePaths = $event->event_image;
        if ($request->hasFile('event_image')) {
            $imagePaths = [];
            foreach ($request->file('event_image') as $imageFile) {
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imagePath = $imageFile->storeAs('events', $imageName, 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
        }

        $event->update([
            'event_name' => $request->event_name ?? $event->event_name,
            'description' => $request->description ?? $event->description,
            'event_image' => $imagePaths,
            'start_date' => $request->start_date ?? $event->start_date,
            'end_date' => $request->end_date ?? $event->end_date,
            'is_active' => $request->is_active ?? $event->is_active,
        ]);

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => new EventResource($event)
        ], 200);
    }

    // Method to activate an event
    public function activateEvent($event_id)
    {
        $event = Event::where('event_id', $event_id)->first();

        if ($event) {
            $event->is_active = true;
            $event->save();

            return response()->json([
                'message' => 'Event activated successfully',
                'data' => $event
            ], 200);
        }

        return response()->json(['message' => 'Event not found'], 404);
    }

    // Method to deactivate an event
    public function deactivateEvent($event_id)
    {
        $event = Event::where('event_id', $event_id)->first();

        if ($event) {
            $event->is_active = false;
            $event->save();

            return response()->json([
                'message' => 'Event deactivated successfully',
                'data' => $event
            ], 200);
        }

        return response()->json(['message' => 'Event not found'], 404);
    }


    // method DELETE
    public function destroy(Event $event)
    {
        if ($event->image) {
            $imagePaths = json_decode($event->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ], 200);
    }
}
