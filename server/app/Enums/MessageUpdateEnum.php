<?php

namespace App\Enums;

enum MessageUpdateEnum: string
{
    case REACTIONS = 'REACTIONS';
    case CONTENT = 'CONTENT';
}
