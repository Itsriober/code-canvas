<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = auth()->user()->projects()->with('rootFiles')->get();
        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        $project = auth()->user()->projects()->create($request->validated());
        
        // Create a root folder and README.md
        $rootFolder = $project->files()->create([
            'name' => 'root',
            'type' => 'folder'
        ]);

        $project->files()->create([
            'name' => 'README.md',
            'type' => 'file',
            'content' => '# ' . $project->name . "\n\nWelcome to your new project!",
            'language' => 'markdown',
            'parent_id' => $rootFolder->id
        ]);

        return new ProjectResource($project->load('rootFiles.children'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);
        return new ProjectResource($project->load('rootFiles.children'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, Project $project)
    {
        $this->authorize('update', $project);
        $project->update($request->validated());
        return new ProjectResource($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->noContent();
    }
}
