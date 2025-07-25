<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileRequest;
use App\Http\Resources\FileResource;
use App\Models\File;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class FileController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);
        $files = $project->rootFiles()->with('children')->get();
        return FileResource::collection($files);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FileRequest $request, Project $project)
    {
        $this->authorize('update', $project);
        $file = $project->files()->create($request->validated());
        return new FileResource($file->load('children'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, File $file)
    {
        $this->authorize('view', $project);
        abort_unless($file->project_id === $project->id, 404);
        return new FileResource($file->load('children'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FileRequest $request, Project $project, File $file)
    {
        $this->authorize('update', $project);
        abort_unless($file->project_id === $project->id, 404);
        $file->update($request->validated());
        return new FileResource($file);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, File $file)
    {
        $this->authorize('delete', $project);
        abort_unless($file->project_id === $project->id, 404);
        $file->delete();
        return response()->noContent();
    }
}
