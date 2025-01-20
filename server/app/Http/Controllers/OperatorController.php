<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Operator;

class OperatorController extends Controller
{
    public function all()
    {
        $operators = Operator::with('team')->get();
        return response()->json($operators);
    }
}
