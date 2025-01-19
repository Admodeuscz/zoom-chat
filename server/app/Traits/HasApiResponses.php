<?php

namespace App\Traits;

trait HasApiResponses
{
    public function responseApi($data, $success = true, $status = 200)
    {
        return response()->json([
            'success' => $success,
            'data' => $data
        ], $status);
    }
}
