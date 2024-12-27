<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\SettingWidgetNoReview as ResourcesSettingWidgetNoReview;
use App\Http\Resources\SettingWidgetNoReviewResource;
use App\Models\SettingWidgetNoReview;
use Illuminate\Support\Facades\Validator;

class SettingWidgetNoReviewController extends Controller
{
    // method GET
    public function index()
    {
        $settings_widget_no_reviews = SettingWidgetNoReview::get();
        if ($settings_widget_no_reviews->count() > 0) {
            return response()->json([
                'message' => 'Get settings success',
                'data' => SettingWidgetNoReview::collection($settings_widget_no_reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST create new setting
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|string',
            'store_id' => 'nullable|string',
            'no_review_title_text' => 'required|string',
            'no_review_subtitle_text' => 'required|string',
            'button_text' => 'required|string',
            'widget_no_review_background_color' => 'required|string|max:7',
            'no_review_title_text_color' => 'required|string|max:7',
            'no_review_subtitle_text_color' => 'required|string|max:7',
            'button_background_color' => 'required|string|max:7',
            'button_text_color' => 'required|string|max:7',
            'widget_no_review_border_color' => 'required|string|max:7',
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

        $settings_widget_no_reviews = SettingWidgetNoReview::create([
            'admin_id' => $request->admin_id,
            'store_id' => $request->store_id,
            'no_review_title_text' => $request->no_review_title_text,
            'no_review_subtitle_text' => $request->no_review_subtitle_text,
            'button_text' => $request->button_text,
            'widget_no_review_background_color' => $request->widget_no_review_background_color,
            'no_review_title_text_color' => $request->no_review_title_text_color,
            'no_review_subtitle_text_color' => $request->no_review_subtitle_text_color,
            'button_background_color' => $request->button_background_color,
            'button_text_color' => $request->button_text_color,
            'widget_no_review_border_color' => $request->widget_no_review_border_color,
        ]);

        return response()->json([
            'message' => 'Setting widget no review created success',
            'data' => new SettingWidgetNoReviewResource($settings_widget_no_reviews)
        ], 201);
    }
}
