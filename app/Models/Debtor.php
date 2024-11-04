<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Credit> $credits
 * @property-read int|null $credits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Debtor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Debtor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Debtor query()
 * @mixin \Eloquent
 */
class Debtor extends Model
{
    protected $fillable = ['name'];
    // Define a constant for the credit total
    public const CREDIT_LIMIT = 80000;
    public function credits()
    {
        return $this->hasMany(Credit::class);
    }

}
