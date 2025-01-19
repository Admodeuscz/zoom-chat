<?php

namespace App\Http\Controllers;
use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    function getChannel($channel_id) {
        $channel = Channel::where('channel_id', $request->channel_id)->first();
        return response()->json($channel);
    }
}
