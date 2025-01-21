<?php

namespace App\Http\Controllers;

use App\Models\Operator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OperatorController extends Controller
{
    public function all()
    {
        $operators = Operator::with('team')
            ->where('op_id', '!=', Auth::id())
            ->get();
        return response()->json($operators);
    }
}
