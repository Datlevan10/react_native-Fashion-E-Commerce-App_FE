<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\WidgetNoReviewSettingResource;
use App\Models\WidgetNoReviewSetting;
use Illuminate\Support\Facades\Validator;

class WidgetNoReviewSettingController extends Controller
{
    // method GET
    public function index()
    {
        $widget_no_reviews_settings = WidgetNoReviewSetting::get();
        if ($widget_no_reviews_settings->count() > 0) {
            return response()->json([
                'message' => 'Get settings success',
                'data' => WidgetNoReviewSettingResource::collection($widget_no_reviews_settings)
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

        $widget_no_reviews_settings = WidgetNoReviewSetting::create([
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
            'data' => new WidgetNoReviewSettingResource($widget_no_reviews_settings)
        ], 201);
    }

    // method GET Detail with no_review_setting_id
    public function show($no_review_setting_id)
    {
        try {
            $setting_widget_no_review = WidgetNoReviewSetting::where('no_review_setting_id', $no_review_setting_id)->first();
            if (!$setting_widget_no_review) {
                return response()->json([
                    'message' => 'Setting not found',
                    'no_review_setting_id' => $no_review_setting_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get Setting success with no_review_setting_id',
                'data' => new WidgetNoReviewSettingResource($setting_widget_no_review)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get setting information', [
                'error' => $e->getMessage(),
                'no_review_setting_id' => $no_review_setting_id
            ]);

            return response()->json([
                'message' => 'Failed to get setting information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // method PUT Update setting
    public function update(Request $request, $no_review_setting_id)
    {
        try {
            $setting_widget_no_review = WidgetNoReviewSetting::where('no_review_setting_id', $no_review_setting_id)->first();

            if (!$setting_widget_no_review) {
                return response()->json([
                    'message' => 'Setting not found',
                    'no_review_setting_id' => $no_review_setting_id
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'admin_id' => 'sometimes|string',
                'store_id' => 'sometimes|string',
                'no_review_title_text' => 'sometimes|string',
                'no_review_subtitle_text' => 'sometimes|string',
                'button_text' => 'sometimes|string',
                'widget_no_review_background_color' => 'sometimes|string|max:7',
                'no_review_title_text_color' => 'sometimes|string|max:7',
                'no_review_subtitle_text_color' => 'sometimes|string|max:7',
                'button_background_color' => 'sometimes|string|max:7',
                'button_text_color' => 'sometimes|string|max:7',
                'widget_no_review_border_color' => 'sometimes|string|max:7',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->messages(),
                ], 422);
            }

            $setting_widget_no_review->update($request->all());

            return response()->json([
                'message' => 'Setting widget no review updated successfully',
                'data' => new WidgetNoReviewSettingResource($setting_widget_no_review),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update setting', [
                'error' => $e->getMessage(),
                'no_review_setting_id' => $no_review_setting_id
            ]);

            return response()->json([
                'message' => 'Failed to update setting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // method DELETE Remove setting
    public function destroy($no_review_setting_id)
    {
        try {
            $setting_widget_no_review = WidgetNoReviewSetting::where('no_review_setting_id', $no_review_setting_id)->first();

            if (!$setting_widget_no_review) {
                return response()->json([
                    'message' => 'Setting not found',
                    'no_review_setting_id' => $no_review_setting_id
                ], 404);
            }

            $setting_widget_no_review->delete();

            return response()->json([
                'message' => 'Setting widget no review deleted successfully',
                'no_review_setting_id' => $no_review_setting_id
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete setting', [
                'error' => $e->getMessage(),
                'no_review_setting_id' => $no_review_setting_id
            ]);

            return response()->json([
                'message' => 'Failed to delete setting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // method POST Reset default setting
    public function resetDefaultSettings(Request $request, $no_review_setting_id)
    {
        $setting = WidgetNoReviewSetting::find($no_review_setting_id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $defaultSettings = [
            "no_review_title_text" => "Customer Reviews",
            "no_review_subtitle_text" => "No review yet. Any feedback? Let us know",
            "button_text" => "Write Review",
            "widget_no_review_background_color" => "#fff",
            "no_review_title_text_color" => "#333",
            "no_review_subtitle_text_color" => "#333",
            "button_background_color" => "#3D4153",
            "button_text_color" => "#fff",
            "widget_no_review_border_color" => "#e5e5e5",
        ];

        $setting->update($defaultSettings);

        return response()->json([
            'success' => true,
            'message' => 'Settings have been reset to default values',
            'data' => new WidgetNoReviewSettingResource($setting)
        ]);
    }
}
