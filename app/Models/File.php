<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'project_id',
        'parent_id',
        'name',
        'type',
        'content',
        'language'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function parent()
    {
        return $this->belongsTo(File::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(File::class, 'parent_id');
    }
}
