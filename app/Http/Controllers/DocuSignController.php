<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DocuSignController extends Controller
{
    public function sign(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $pdfBase64 = base64_encode(
            file_get_contents($request->file('file')->getRealPath())
        );

        $accountId = env('DOCUSIGN_ACCOUNT_ID');
        $accessToken = $this->getAccessToken();

        // Create envelope (NOT sent yet)
        $envelopeResp = Http::withToken($accessToken)
            ->post(env('DOCUSIGN_BASE_URI') . "/restapi/v2.1/accounts/{$accountId}/envelopes", [
                "emailSubject" => "Please sign this document",
                "documents" => [
                    [
                        "documentBase64" => $pdfBase64,
                        "name" => $request->file('file')->getClientOriginalName(),
                        "fileExtension" => "pdf",
                        "documentId" => "1"
                    ]
                ],
                "status" => "created" //important
            ]);

        if (!$envelopeResp->successful()) {
            return response()->json([
                'error' => 'Failed to create envelope',
                'details' => $envelopeResp->json()
            ], 500);
        }

        $envelopeId = $envelopeResp->json()['envelopeId'];

        // Generate Sender View (DocuSign Editor)
        $viewResp = Http::withToken($accessToken)
            ->post(env('DOCUSIGN_BASE_URI') . "/restapi/v2.1/accounts/{$accountId}/envelopes/{$envelopeId}/views/sender", [
                "returnUrl" => env('DOCUSIGN_REDIRECT_URI')
            ]);

        if (!$viewResp->successful()) {
            return response()->json([
                'error' => 'Failed to open DocuSign editor',
                'details' => $viewResp->json()
            ], 500);
        }

        return response()->json([
            'url' => $viewResp->json()['url']
        ]);
    }

    public function callback()
    {
        return "Document prepared successfully!";
    }

    private function getAccessToken()
    {
        return env('DOCUSIGN_ACCESS_TOKEN');
    }
}
