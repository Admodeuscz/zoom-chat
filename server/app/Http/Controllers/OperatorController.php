<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Operator;

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
